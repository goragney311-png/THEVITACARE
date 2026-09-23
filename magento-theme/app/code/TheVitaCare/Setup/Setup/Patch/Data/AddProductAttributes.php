<?php
declare(strict_types=1);

namespace TheVitaCare\Setup\Setup\Patch\Data;

use Magento\Catalog\Model\Product;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;

/**
 * Adds the extra product attributes used by the theme (brand, ingredients, dosage, benefits, form).
 * They are visible on the product page "Additional information" tab.
 */
class AddProductAttributes implements DataPatchInterface
{
    public function __construct(
        private readonly ModuleDataSetupInterface $moduleDataSetup,
        private readonly EavSetupFactory $eavSetupFactory
    ) {}

    public function apply(): void
    {
        $eav = $this->eavSetupFactory->create(['setup' => $this->moduleDataSetup]);
        $attrs = [
            'brand'       => ['label' => 'Brand',             'type' => 'varchar', 'input' => 'text',     'searchable' => true],
            'form'        => ['label' => 'Form',              'type' => 'varchar', 'input' => 'text'],
            'ingredients' => ['label' => 'Ingredients',       'type' => 'text',    'input' => 'textarea'],
            'dosage'      => ['label' => 'How to Use / Dosage','type' => 'text',   'input' => 'textarea'],
            'benefits'    => ['label' => 'Key Benefits',      'type' => 'text',    'input' => 'textarea', 'wysiwyg' => true],
        ];
        $sort = 100;
        foreach ($attrs as $code => $a) {
            $eav->addAttribute(Product::ENTITY, $code, [
                'type' => $a['type'],
                'label' => $a['label'],
                'input' => $a['input'],
                'required' => false,
                'user_defined' => true,
                'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
                'visible' => true,
                'visible_on_front' => true,
                'used_in_product_listing' => false,
                'searchable' => $a['searchable'] ?? false,
                'is_html_allowed_on_front' => true,
                'wysiwyg_enabled' => $a['wysiwyg'] ?? false,
                'group' => 'Product Details',
                'sort_order' => $sort++,
            ]);
        }
    }

    public static function getDependencies(): array { return []; }
    public function getAliases(): array { return []; }
}
